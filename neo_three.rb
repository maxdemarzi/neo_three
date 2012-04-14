require 'rubygems'
require 'neography'
require 'sinatra'
require 'uri'
require 'gon-sinatra'


class App < Sinatra::Base
  register Gon::Sinatra

  def generate_text(length=8)
    chars = 'abcdefghjkmnpqrstuvwxyz'
    key = ''
    length.times { |i| key << chars[rand(chars.length)] }
    key
  end
  
  def create_graph
    neo = Neography::Rest.new
    graph_exists = neo.get_node_properties(1)
    return if graph_exists && graph_exists['name']
  
    commands = []
  
    batch_result = neo.batch *commands
  end
  
  def nodes
    neo = Neography::Rest.new
    cypher_query =  " START node = node:nodes_index(type='User')"
    cypher_query << " RETURN ID(node), node"
    neo.execute_query(cypher_query)["data"].collect{|n| {"id" => n[0]}.merge(n[1]["data"])}
  end  
  
  def edges
    neo = Neography::Rest.new
    cypher_query =  " START source = node:nodes_index(type='User')"
    cypher_query << " MATCH source -[rel]-> target"
    cypher_query << " RETURN ID(rel), ID(source), ID(target)"
    neo.execute_query(cypher_query)["data"].collect{|n| {"id" => n[0], "source" => n[1], "target" => n[2]} }
  end
  
  get '/' do
    neo = Neography::Rest.new
    gon.nodes = nodes  
    gon.edges = edges
    erb :index
  end
end